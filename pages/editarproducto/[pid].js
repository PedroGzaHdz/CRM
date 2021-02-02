import React from "react";
import {useRouter} from "next/router";
import Layout from "../../components/Layout";
import {Formik} from "formik";
import * as Yup from "yup"
import {gql, useQuery, useMutation} from "@apollo/client";
import Swal from "sweetalert2";


const OBTENER_PRODUCTO = gql`query obtenerProductoID($id:ID!){
    obtenerProductoID(id:$id){
        id
        nombre
        existencia
        precio
        creado     
    }
}
`

const ACTUALIZAR_PRODUCTOS = gql`mutation actualizarProducto($id:ID!,$input:ProductoInpur!){
    actualizarProducto(id: $id, input: $input){
        id
        nombre
        existencia
        precio
        creado      
    }
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

const EditarProducto = () => {
    //Obtener el id actual
    const router = useRouter();
    const {query: {id}} = router;
    //Consultar para obtener el producto
    const {data, loading, error} = useQuery(OBTENER_PRODUCTO, {
        variables: {
            id
        }
    });
    // Actualizar Producto
    const [actualizarProducto] = useMutation(ACTUALIZAR_PRODUCTOS,{
        update(cache, {
            data:{
                actualizarProducto
            }
        }){
            // Obtenor una copia
            const {obtenerProductos} = cache.readQuery({query: OBTENER_PRODUCTOS});
            // reescribir el cache
            cache.writeQuery({
                query: OBTENER_PRODUCTOS,
                data: {
                    obtenerProductos: [...obtenerProductos.filter(user => user.id !== id), actualizarProducto]
                }
            })
        }
    })

    //Schema de validadción
    const shemaValidacion = Yup.object({
        nombre: Yup.string().required('El nombre del producto es obligatorío.'),
        existencia: Yup.string().required('La existencía es obligatorío.'),
        precio: Yup.string().required('El precio es obligatorío'),

    })
    if (loading) return 'Cargando....'

    const {obtenerProductoID} = data;

    const onSubmit = async (valores) => {
        try {
            const {nombre, existencia, precio} = valores;
            await actualizarProducto({
                variables: {
                    id,
                    input: {
                        nombre,
                        existencia: +existencia,
                        precio
                    }
                }
            });
            //TODO:  Sweet Alert
            Swal.fire(
                'Producto Actualizado!',
                "Actualizado con existo",
                'success'
            )
            //TODO Redireccionar
            router.push('/productos');

        } catch (e) {
            console.log(e)
        }
    }
    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light"> Editar Producto</h1>
            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">
                    <Formik
                        validationSchema={shemaValidacion}
                        enableReinitialize
                        initialValues={obtenerProductoID}
                        onSubmit={onSubmit}
                    >
                        {props => {
                            return (
                                <form className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
                                      onSubmit={props.handleSubmit}
                                >
                                    <div className='mb-4'>
                                        <label className="block text-gray-700 text-sm font-bold mb-2 " htmlFor='nombre'>
                                            Nombre
                                        </label>
                                        <input
                                            id='nombre'
                                            type='text'
                                            className="shadow appearace-none border rounded w-full py-2 px-3 text-gray-700 leading-tigth focus:outline-none focus:shadow-outline"
                                            placeholder='Nombre'
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.nombre}
                                        />
                                    </div>

                                    {
                                        props.touched.nombre && props.errors.nombre ? (
                                            <div
                                                className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 '>
                                                <p className="font-bold">Error</p>
                                                <p>{props.errors.nombre}</p>
                                            </div>
                                        ) : null
                                    }

                                    <div className='mb-4'>
                                        <label className="block text-gray-700 text-sm font-bold mb-2 "
                                               htmlFor='existencia'>
                                            Existencía
                                        </label>
                                        <input
                                            id='existencia'
                                            type='text'
                                            className="shadow appearace-none border rounded w-full py-2 px-3 text-gray-700 leading-tigth focus:outline-none focus:shadow-outline"
                                            placeholder='Existencía'
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.existencia}
                                        />

                                    </div>

                                    {
                                        props.touched.existencia && props.errors.existencia ? (
                                            <div
                                                className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 '>
                                                <p className="font-bold">Error</p>
                                                <p>{props.errors.existencia}</p>
                                            </div>
                                        ) : null
                                    }


                                    <div className='mb-4'>
                                        <label className="block text-gray-700 text-sm font-bold mb-2 "
                                               htmlFor='precio'>
                                            Precio
                                        </label>
                                        <input
                                            id='precio'
                                            type='text'
                                            className="shadow appearace-none border rounded w-full py-2 px-3 text-gray-700 leading-tigth focus:outline-none focus:shadow-outline"
                                            placeholder='Empresa'
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.precio}
                                        />

                                    </div>

                                    {
                                        props.touched.precio && props.errors.precio ? (
                                            <div
                                                className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 '>
                                                <p className="font-bold">Error</p>
                                                <p>{props.errors.precio}</p>
                                            </div>
                                        ) : null
                                    }


                                    <input
                                        type='submit'
                                        className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
                                        value='Guardar Producto'
                                    />
                                </form>
                            )
                        }}

                    </Formik>
                </div>

            </div>
        </Layout>
    )
}

export default EditarProducto;
