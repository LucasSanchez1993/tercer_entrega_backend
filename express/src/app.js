const fs = require('fs');

const express = require ('express');

const PORT = 3000;

const app = express();

class ProductManager {
    constructor(rutaArchivo) {
        this.path = rutaArchivo;
        this.products = [];

        if (fs.existsSync(this.path)) {
            const fileData = fs.readFileSync(this.path, 'utf-8');
            this.products = JSON.parse(fileData);
        }
    }

    addProduct(title, description, price, thumbnail, code, stock) {
        let id = 1;

        if (this.products.length > 0) {
            id = this.products[this.products.length - 1].id + 1;
        }

        let newProduct = { id, title, description, price, thumbnail, code, stock };
        this.products.push(newProduct);

        fs.writeFileSync(this.path, JSON.stringify(this.products));

        console.log("Cargo de producto");

        let lecturaProducto = fs.readFileSync(this.path, "utf-8");
        console.log(lecturaProducto);

        fs.appendFileSync(this.path, "\n\nProducto agregado");

        lecturaProducto = fs.readFileSync(this.path, "utf-8");
        console.log(lecturaProducto);

        setTimeout(() => {
            fs.unlinkSync(this.path);
        }, 2000);

        let exists = this.products.find(p => p.code === code);
        if (exists) {
            console.log(`El producto con este ${code} ya existe!!`);
            return;
        }
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        return this.products.find(product => product.id === id);
    }
    updateProduct(id,newName) {
        let productIndex = this.products.findIndex(product => product.id === id);
        if (productIndex !== -1) {
            this.products[productIndex].title = newName;
            fs.writeFileSync(this.path, JSON.stringify(this.products));
            console.log(`Producto con ID ${id} actualizado a: ${newName}`);
        } else {
            console.log(`No se encontró ningún producto con el ID ${id}`);
        }
    }

    deleteProduct(id) {
        let productIndex = this.products.findIndex(product => product.id === id);
        if (productIndex !== -1) {
            this.products.splice(productIndex, 1);
            fs.writeFileSync(this.path, JSON.stringify(this.products));
            console.log(`Producto con ID ${id} eliminado.`);
        } else {
            console.log(`No se encontró ningún producto con el ID ${id}`);
        }
    }
}

let prodManager = new ProductManager('products.json');
prodManager.addProduct('arroz', 'blanco', 1000, 'img1', 1, 50);
prodManager.addProduct('leche', 'entera', 500, 'img2', 2, 30);
prodManager.addProduct('azucar', 'blanca', 1100, 'img3', 3, 45);

console.log("Hola");
console.log("Estos son los productos:", prodManager.getProducts());
console.log("Mi producto con ID 2 es:", prodManager.getProductById(2));

prodManager.updateProduct(1, 'garbanzo');
prodManager.deleteProduct(2);

app.get('/bienvenida',(req, res)=>{

    res.setHeader("Content-Type","text/html")
    res.send("<h2 style='color:orange;'>Hola profe!!!</h2>")
})

app.get('/products',(req,res)=>{
    
    let resultado = products

    if(req.query.limit){
        resultado=resultado.slice(0, req.query.limit)
    }

    res.setHeader('Content-Type','application/json');
    res.status(200).json({filtros: req.query,resultado });
})

app.get('/products/:id', (req, res) => {
    
    let id = req.params.id;
        id = parseInt(id);
        if (isNaN(id)) {
               
    return res.send('Error, ingrese un número entero');
        }
    
        let resultado = prodManager.getProductById(id);
        
        res.setHeader('Content-Type', 'application/json');

        res.status(200).json({ resultado });
    });

const server = app.listen(PORT,()=>{
    console.log(`Server escuchando en puerto ${PORT}`);
});




app.get('/products/:id', (req, res) => {
    
   
    let id = req.params.id;
        id = parseInt(id);
        if (isNaN(id)) {
            
           
    return res.send('Error, ingrese un número entero');
        }
    
        let resultado = prodManager.getProductById(id);

        res.setHeader('Content-Type', 'application/json');

        res.status(200).json({ resultado });
    });