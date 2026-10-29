const usuarios = [
    { 
        id: 2, 
        nombre: "Susana", 
        email: "admin@pizzeria.com",
        password: "qwe1234"
    },
     { 
        id: 3, 
        nombre: "Chef Principal",
        email: "chef@pizzeria.com",
        password: "chefsito123"
    }
];

function getAllUsers() {
  return usuarios;
}

function getUser(id) {
  for (usuario in usuarios) {
    console.log(usuario);
    if ((usuario.id = id)) {
      return usuarios[usuario];
    }
  }
  return false;
}

function editUser(id, info) {
  usuario = getUser(id);

  let { nombre, telefono, edad } = info;

  nombre != undefined ? (usuario.nombre = nombre) : usuario.nombre;
  telefono != undefined ? (usuario.telefono = telefono) : usuario.telefono;
  edad != undefined ? (usuario.edad = edad) : usuario.edad;

  return usuario;
}

module.exports = {
  editUser,
  getAllUsers,
  getUser,
};