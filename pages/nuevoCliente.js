import React, {useState} from "react";
import Layout from "../components/Layout";
import {useFormik} from "formik";
import * as Yup from "yup"
import {gql, useMutation} from "@apollo/client";
import {useRouter} from "next/router";

const NUEVO_CLIENTE = gql`mutation nuevoCliente($input: ClienteInput){
    nuevoCliente(input: $input){
        nombre
        apellido    
        id
        empresa
        email
        telefono
    }
}
`;

const OBTENER_CLIENTE_USUARIO = gql`
    query obtenerClientesVendedor{
        obtenerClientesVendedor{
            nombre
            apellido
            email
            empresa
            id
        }
    }
`


const NuevoCliente = () => {

    const router = useRouter();

    //State de mensaje
    const [mensaje, setMensaje] = useState(null);
    // Mutation para crear un Cliente
    const [nuevoClient] = useMutation(NUEVO_CLIENTE, {
        update(cache, {
            data: {
                nuevoCliente
            }
        }) {
            // Obtener ekl objeto del cache que deseamos actualizar
            const {obtenerClientesVendedor} = cache.readQuery({query: OBTENER_CLIENTE_USUARIO});
            // Rescribit el cache no se debe mutar
            cache.writeQuery({
                query: OBTENER_CLIENTE_USUARIO,
                data: {
                    obtenerClientesVendedor: [
                        ...obtenerClientesVendedor,
                        nuevoCliente
                    ]
                }
            });


        }
    });
    const formik = useFormik({
        initialValues: {
            nombre: '',
            apellido: '',
            empresa: '',
            email: '',
            telefono: '',
        },
        validationSchema: Yup.object({
            nombre: Yup.string().required('El nombre del cliente es obligatorío.'),
            apellido: Yup.string().required('El apellido del cliente es obligatorío.'),
            empresa: Yup.string().required('La empresa del cliente es obligatorío.'),
            email: Yup.string().email('Email no valido').required('El email del cliente es obligatorío.'),
            telefono: Yup.string()

        }),
        onSubmit: async values => {
            const {apellido, nombre, empresa, email, telefono} = values;
            try {

                 await nuevoClient({
                    variables: {
                        input: {
                            nombre,
                            apellido,
                            empresa,
                            email,
                            telefono
                        }
                    }
                });
                router.push('/');
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
            <h1 className="text-2xl text-gray-800 font-light"> Nuevo cliente</h1>
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
                            <label className="block text-gray-700 text-sm font-bold mb-2 " htmlFor='apellido'>
                                Apellido
                            </label>
                            <input
                                id='apellido'
                                type='text'
                                className="shadow appearace-none border rounded w-full py-2 px-3 text-gray-700 leading-tigth focus:outline-none focus:shadow-outline"
                                placeholder='Apellido'
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.apellido}
                            />

                        </div>

                        {
                            formik.touched.apellido && formik.errors.apellido ? (
                                <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 '>
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.apellido}</p>
                                </div>
                            ) : null
                        }


                        <div className='mb-4'>
                            <label className="block text-gray-700 text-sm font-bold mb-2 " htmlFor='empresa'>
                                Empresa
                            </label>
                            <input
                                id='empresa'
                                type='text'
                                className="shadow appearace-none border rounded w-full py-2 px-3 text-gray-700 leading-tigth focus:outline-none focus:shadow-outline"
                                placeholder='Empresa'
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.empresa}
                            />

                        </div>

                        {
                            formik.touched.empresa && formik.errors.empresa ? (
                                <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 '>
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.empresa}</p>
                                </div>
                            ) : null
                        }
                        <div className='mb-4'>
                            <label className="block text-gray-700 text-sm font-bold mb-2 " htmlFor='email'>
                                Email
                            </label>
                            <input
                                id='email'
                                type='text'
                                className="shadow appearace-none border rounded w-full py-2 px-3 text-gray-700 leading-tigth focus:outline-none focus:shadow-outline"
                                placeholder='Email'
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.email}
                            />

                        </div>

                        {
                            formik.touched.email && formik.errors.email ? (
                                <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 '>
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.email}</p>
                                </div>
                            ) : null
                        }

                        <div className='mb-4'>
                            <label className="block text-gray-700 text-sm font-bold mb-2 " htmlFor='telefono'>
                                Télefono
                            </label>
                            <input
                                id='telefono'
                                type='text'
                                className="shadow appearace-none border rounded w-full py-2 px-3 text-gray-700 leading-tigth focus:outline-none focus:shadow-outline"
                                placeholder='23859332162'
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.telefono}
                            />

                        </div>

                        <input
                            type='submit'
                            className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
                            value='Resgistrar Cliente'
                        />
                    </form>
                </div>

            </div>
        </Layout>
    )
}

export default NuevoCliente

