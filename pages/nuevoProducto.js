import React, {useState} from "react";
import Layout from "../components/Layout";
import {useFormik} from "formik";
import * as Yup from "yup"
import {gql, useMutation} from "@apollo/client";
import {useRouter} from "next/router";

const NUEVO_PRODUCTO = gql`mutation nuevoProducto($input: ProductoInpur){
    nuevoProducto(input: $input){
        id
        nombre
        existencia
        precio
        creado
    }
}
`;
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
const NuevoProducto = () => {

    const router = useRouter();

    //State de mensaje
    const [mensaje, setMensaje] = useState(null);
    // Mutation para crear un Cliente
    const [nuevoProducto] = useMutation(NUEVO_PRODUCTO, {
        update(cache, {
            data: {
                nuevoProducto
            }
        }) {
            // Obtener ekl objeto del cache que deseamos actualizar
            const {obtenerProductos} = cache.readQuery({query: OBTENER_PRODUCTOS});
            // Rescribit el cache no se debe mutar
            cache.writeQuery({
                query: OBTENER_PRODUCTOS,
                data: {
                    obtenerProductos: [
                        ...obtenerProductos,
                        nuevoProducto
                    ]
                }
            });


        }
    });
    const formik = useFormik({
        initialValues: {
            nombre: '',
            existencia: '',
            precio: '',
        },
        validationSchema: Yup.object({
            nombre: Yup.string().required('El nombre del producto es obligatorío.'),
            existencia: Yup.string().required('La existencía es obligatorío.'),
            precio: Yup.string().required('El precio es obligatorío'),

        }),
        onSubmit: async values => {
            const {nombre, existencia, precio} = values;
            try {
                await nuevoProducto({
                    variables: {
                        input: {
                            nombre,
                            existencia: +existencia,
                            precio
                        }
                    }
                });
                router.push('/productos');
            } catch (e) {
                setMensaje(e.message)
                setTimeout(() => {
                    setMensaje(null)
                }, 3000)
            }
        }
    })
    const mostrarMensaje = () => {
        return (
            <div className='bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto'>
                <p>{mensaje}</p>
            </div>
        )
    }
    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light"> Nuevo producto</h1>
            {mensaje && mostrarMensaje()}
            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">

                    <form className="bg-white shadow-md px-8 pt-6 pb-8 mb-4" onSubmit={formik.handleSubmit}>
                        <div className='mb-4'>
                            <label className="block text-gray-700 text-sm font-bold mb-2 " htmlFor='nombre'>
                                Nombre
                            </label>
                            <input
                                id='nombre'
                                type='text'
                                className="shadow appearace-none border rounded w-full py-2 px-3 text-gray-700 leading-tigth focus:outline-none focus:shadow-outline"
                                placeholder='Nombre'
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.nombre}
                            />
                        </div>

                        {
                            formik.touched.nombre && formik.errors.nombre ? (
                                <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 '>
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.nombre}</p>
                                </div>
                            ) : null
                        }

                        <div className='mb-4'>
                            <label className="block text-gray-700 text-sm font-bold mb-2 " htmlFor='existencia'>
                                Existencia
                            </label>
                            <input
                                id='existencia'
                                type='number'
                                className="shadow appearace-none border rounded w-full py-2 px-3 text-gray-700 leading-tigth focus:outline-none focus:shadow-outline"
                                placeholder='Existencía'
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.existencia}
                            />

                        </div>

                        {
                            formik.touched.existencia && formik.errors.existencia ? (
                                <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 '>
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.existencia}</p>
                                </div>
                            ) : null
                        }


                        <div className='mb-4'>
                            <label className="block text-gray-700 text-sm font-bold mb-2 " htmlFor='precio'>
                                Precio
                            </label>
                            <input
                                id='precio'
                                type='text'
                                className="shadow appearace-none border rounded w-full py-2 px-3 text-gray-700 leading-tigth focus:outline-none focus:shadow-outline"
                                placeholder='Precio'
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.precio}
                            />

                        </div>

                        {
                            formik.touched.precio && formik.errors.precio ? (
                                <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 '>
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.precio}</p>
                                </div>
                            ) : null
                        }

                        <input
                            type='submit'
                            style={{cursor: "pointer"}}
                            className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
                            value='Resgistrar Producto'
                        />
                    </form>
                </div>

            </div>
        </Layout>
    )
}

export default NuevoProducto;

