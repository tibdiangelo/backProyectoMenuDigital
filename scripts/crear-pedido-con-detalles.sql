-- Ejecutar este archivo una vez en el SQL Editor de Supabase.
-- Crea la función que inserta el pedido y todos sus detalles en una sola transacción.
-- Si cualquier validación o inserción falla, PostgreSQL revierte todo automáticamente.

create or replace function public.crear_pedido_con_detalles(
    p_mesa_id integer,
    p_usuario_id integer,
    p_estado text,
    p_cliente_nombre text,
    p_notas text,
    p_detalles jsonb
)
returns jsonb
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
declare
    v_pedido public.pedidos%rowtype;
    v_item record;
    v_plato_id integer;
    v_cantidad integer;
    v_precio numeric;
    v_total numeric := 0;
    v_detalles_insert jsonb := '[]'::jsonb;
    v_detalles_creados jsonb := '[]'::jsonb;
    v_detalle_id integer;
begin
    if p_mesa_id is null or p_mesa_id <= 0 then
        raise exception 'Debes indicar una mesa válida para el pedido.'
            using errcode = '22023';
    end if;

    if p_detalles is null
        or jsonb_typeof(p_detalles) <> 'array'
        or jsonb_array_length(p_detalles) = 0 then
        raise exception 'El pedido debe incluir al menos un detalle.'
            using errcode = '22023';
    end if;

    -- Primera pasada: validar cada detalle y calcular el total con los precios reales.
    for v_item in select * from jsonb_array_elements(p_detalles) as t(value)
    loop
        begin
            v_plato_id := (v_item.value ->> 'plato_id')::integer;
            v_cantidad := (v_item.value ->> 'cantidad')::integer;
        exception
            when others then
                raise exception 'Cada detalle debe incluir plato_id y cantidad válidos.'
                    using errcode = '22023';
        end;

        if v_plato_id is null or v_plato_id <= 0 then
            raise exception 'Cada detalle debe incluir un plato_id válido.'
                using errcode = '22023';
        end if;

        if v_cantidad is null or v_cantidad <= 0 then
            raise exception 'La cantidad del plato % debe ser mayor que cero.', v_plato_id
                using errcode = '22023';
        end if;

        select precio
        into v_precio
        from public.platos
        where id = v_plato_id;

        if not found then
            raise exception 'El plato con id % no existe.', v_plato_id
                using errcode = '22023';
        end if;

        if v_precio is null or v_precio < 0 then
            raise exception 'El plato con id % no tiene un precio válido.', v_plato_id
                using errcode = '22023';
        end if;

        v_total := v_total + (v_precio * v_cantidad);
        v_detalles_insert := v_detalles_insert || jsonb_build_object(
            'plato_id', v_plato_id,
            'cantidad', v_cantidad,
            'precio_unitario', v_precio
        );
    end loop;

    -- El total se calcula aquí, nunca se toma el que envíe el frontend.
    insert into public.pedidos (
        mesa_id,
        usuario_id,
        total,
        estado,
        cliente_nombre,
        notas,
        fecha
    )
    values (
        p_mesa_id,
        p_usuario_id,
        v_total,
        coalesce(nullif(btrim(p_estado), ''), 'Pendiente'),
        p_cliente_nombre,
        p_notas,
        now()
    )
    returning * into v_pedido;

    -- Segunda pasada: insertar los detalles ya validados con el precio real.
    for v_item in select * from jsonb_array_elements(v_detalles_insert) as t(value)
    loop
        v_plato_id := (v_item.value ->> 'plato_id')::integer;
        v_cantidad := (v_item.value ->> 'cantidad')::integer;
        v_precio := (v_item.value ->> 'precio_unitario')::numeric;

        insert into public.detalle_pedido (
            pedido_id,
            plato_id,
            cantidad,
            precio_unitario
        )
        values (
            v_pedido.id,
            v_plato_id,
            v_cantidad,
            v_precio
        )
        returning id into v_detalle_id;

        v_detalles_creados := v_detalles_creados || jsonb_build_object(
            'id', v_detalle_id,
            'pedido_id', v_pedido.id,
            'plato_id', v_plato_id,
            'cantidad', v_cantidad,
            'precio_unitario', v_precio
        );
    end loop;

    return to_jsonb(v_pedido) || jsonb_build_object(
        'detalle_pedido', v_detalles_creados
    );
end;
$$;

grant execute on function public.crear_pedido_con_detalles(
    integer,
    integer,
    text,
    text,
    text,
    jsonb
) to anon, authenticated;

notify pgrst, 'reload schema';
