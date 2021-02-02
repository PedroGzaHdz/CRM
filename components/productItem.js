import React from "react";
import Swal from "sweetalert2";
import {gql, useMutation} from "@apollo/client"
import Router from "next/router";


const ELIMINAR_PRODUCTO = gql`mutation EliminarProducto($id: ID!){
        EliminarProducto(id:$id)
    }   
`

const OBTENER_PRODUCTOS = gql`query obtenerProductos{
    obtenerProductos{
        id
        nombre
        existencia
        precio
        creado
    }
}
`
const ProductoItem = (props) => {
    // Mutation
    const [EliminarProducto] = useMutation(ELIMINAR_PRODUCTO, {
        update(cache) {
            // Obtenor una copia
            const {obtenerProductos} = cache.readQuery({query: OBTENER_PRODUCTOS});
            // reescribir el cache
            cache.writeQuery({
                query: OBTENER_PRODUCTOS,
                data: {
                    obtenerProductos: obtenerProductos.filter(user => user.id !== id)
                }
            })
        }
    })

    const {product} = props;
    const {nombre, existencia, creado, precio, id} = product;
    const confirmarEliminarProducto = () => {
        Swal.fire({
            title: "¿Deseas eliminar a este producto?",
            text: "Esta acción no se puede desacer!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Eliminar!',
            cancelButtonText: 'No, Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // Eliminar por Id
                    const {data} = await EliminarProducto({
                        variables: {
                            id
                        }
                    })
                    //Mostrar alerta

                    Swal.fire(
                        'Producto Borrado!',
                        data.EliminarProducto,
                        'success'
                    )
                } catch (e) {
                    console.error(e)
                }

            }
        })
    }
    const editarProducto = () => {
        Router.push({
            pathname: "/editarproducto/[id]",
            query: {id}
        })
    }
    return (
        <tr key={id.toString()}>
            <td className="border px-4 py-2">{nombre}</td>
            <td className="border px-4 py-2">{existencia}</td>
            <td className="border px-4 py-2">$ {precio}</td>
            <td className="border px-4 py-2">
                <button
                    type='button'
                    className='flex justify-center items-center bg-red-800 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold'
                    onClick={() => confirmarEliminarProducto()}
                >
                    Eliminar
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                         xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </button>
            </td>
            <td className="border px-4 py-2">
                <button
                    type='button'
                    className='flex justify-center items-center bg-green-600 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold'
                    onClick={() => editarProducto()}
                >
                    Editar
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                         xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                    </svg>
                </button>
            </td>
        </tr>
    )
}

export default ProductoItem

