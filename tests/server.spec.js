const request = require("supertest");
const server = require("../index");

describe("Operaciones CRUD", () => {
    it( "Obteniendo status 200 de ruta productos", async () => {
        const res = await request(server).get("/productos").send();
        const status = res.statusCode;
        expect(status).toBe(200);
    });
    it( "Obteniendo status de una ruta inexistente", async () => {
        const res = await request(server).get("/servicios").send();
        const status = res.statusCode;
        expect(status).toBe(404);
    });
    it( "Obteniendo un producto", async () => {
        const { body } = await request(server).get("/productos/1").send();
        const producto = body;
        expect(producto).toBeInstanceOf(Object);
    });
    it( "Obteniendo todos los productos", async () => {
        const { body } = await request(server).get("/productos").send();
        const producto = body;
        expect(producto).toBeInstanceOf(Array);
    });
    it( "Enviando un nuevo producto", async () => {
        const id = Math.floor( Math.random() * 999 );
        const producto = { id, nombre: "Nuevo Producto" };
        const { body : productos } = await request(server)
            .post("/productos")
            .send(producto);
        expect(productos).toContainEqual(producto);
    });
    it( "Sobrescribiendo un producto inexistente", async () => {
        const id = 100;
        const producto = { id, nombre: "Nombre actualizado de producto" };
        const res = await request(server)
            .put("/productos")
            .send(producto);
        const status = res.statusCode;
        expect(status).toBe(404);
    });
    it( "Eliminando un producto", async () => {
        const jwt = "token";    // Es solo un ejemplo sin aplicación de un token real.
        const idDeProductoAEliminar = 4;
        const { body: productos } = await request(server)
            .delete(`/productos/${idDeProductoAEliminar}`)
            .set("Authorization", jwt)
            .send();
        const ids = productos.map(p => p.id)
        expect(ids).not.toContain(idDeProductoAEliminar);
    });
    it( "Eliminando un producto sin entregar un token", async () => {
        const idDeProductoAEliminar = 4;
        const response = await request(server)
            .delete(`/productos/${idDeProductoAEliminar}`)
            .send();
        const status = response.statusCode;
        expect(status).toBe(400);
    });
});