import React from "react";
import {useRouter} from "next/router";
import Layout from "../../components/Layout";
import {Formik} from "formik";
import * as Yup from "yup"
import {gql, useQuery, useMutation} from "@apollo/client";
import Swal from "sweetalert2";


const OBTENER_CLIENTE = gql`query obtenerCliente($id:ID!){
    obtenerCliente(id:$id){
        nombre
        apellido
        email
        telefono
        empresa        
    }
}
`

const ACTUALIZAR_CLIENTE = gql`mutation actualizarCliente($id:ID!,$input:ClienteInput){
    actualizarCliente(id: $id, input: $input){
        nombre
        apellido
        email
        telefono
        empresa        
    }
} 
`
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

const EditarCliente = () => {
    //Obtener el id actual
    const router = useRouter();
    const {query: {id}} = router;
    //Consultar para obtener el client
    const {data, loading, error} = useQuery(OBTENER_CLIENTE, {
        variables: {
            id
        }
    });
    // Actualizar Cliente
    const [actualizarCliente] = useMutation(ACTUALIZAR_CLIENTE,{
        update(cache, {
            data:{
                actualizarCliente
            }
        }){
            // Obtenor una copia
            const {obtenerClientesVendedor} = cache.readQuery({query: OBTENER_CLIENTE_USUARIO});
            // reescribir el cache
            cache.writeQuery({
                query: OBTENER_CLIENTE_USUARIO,
                data: {
                    obtenerClientesVendedor: [...obtenerClientesVendedor.filter(user => user.id !== id),actualizarCliente]
                }
            })
        }
    })

    //Schema de validadción
    const shemaValidacion = Yup.object({
        nombre: Yup.string().required('El nombre del cliente es obligatorío.'),
        apellido: Yup.string().required('El apellido del cliente es obligatorío.'),
        empresa: Yup.string().required('La empresa del cliente es obligatorío.'),
        email: Yup.string().email('Email no valido').required('El email del cliente es obligatorío.'),
        telefono: Yup.string()

    })
    if (loading) return 'Cargando....'

    const {obtenerCliente} = data;

    const onSubmit = async (valores) => {
        try {
            const {nombre, apellido, email, empresa, telefono} = valores;
            const {data} = await actualizarCliente({
                variables: {
                    id,
                    input: {
                        nombre, apellido, email, empresa, telefono
                    }
                }
            });
            //TODO:  Sweet Alert
            Swal.fire(
                'Cliente Actualizado!',
                "Actualizado con existo",
                'success'
            )
            //TODO Redireccionar
            router.push('/');

        } catch (e) {
            console.error(e)
        }
    }
    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light"> Editar cliente</h1>
            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">
                    <Formik
                        validationSchema={shemaValidacion}
                        enableReinitialize
                        initialValues={obtenerCliente}
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
                                               htmlFor='apellido'>
                                            Apellido
                                        </label>
                                        <input
                                            id='apellido'
                                            type='text'
                                            className="shadow appearace-none border rounded w-full py-2 px-3 text-gray-700 leading-tigth focus:outline-none focus:shadow-outline"
                                            placeholder='Apellido'
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.apellido}
                                        />

                                    </div>

                                    {
                                        props.touched.apellido && props.errors.apellido ? (
                                            <div
                                                className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 '>
                                                <p className="font-bold">Error</p>
                                                <p>{props.errors.apellido}</p>
                                            </div>
                                        ) : null
                                    }


                                    <div className='mb-4'>
                                        <label className="block text-gray-700 text-sm font-bold mb-2 "
                                               htmlFor='empresa'>
                                            Empresa
                                        </label>
                                        <input
                                            id='empresa'
                                            type='text'
                                            className="shadow appearace-none border rounded w-full py-2 px-3 text-gray-700 leading-tigth focus:outline-none focus:shadow-outline"
                                            placeholder='Empresa'
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.empresa}
                                        />

                                    </div>

                                    {
                                        props.touched.empresa && props.errors.empresa ? (
                                            <div
                                                className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 '>
                                                <p className="font-bold">Error</p>
                                                <p>{props.errors.empresa}</p>
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
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.email}
                                        />

                                    </div>

                                    {
                                        props.touched.email && props.errors.email ? (
                                            <div
                                                className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 '>
                                                <p className="font-bold">Error</p>
                                                <p>{props.errors.email}</p>
                                            </div>
                                        ) : null
                                    }

                                    <div className='mb-4'>
                                        <label className="block text-gray-700 text-sm font-bold mb-2 "
                                               htmlFor='telefono'>
                                            Télefono
                                        </label>
                                        <input
                                            id='telefono'
                                            type='text'
                                            className="shadow appearace-none border rounded w-full py-2 px-3 text-gray-700 leading-tigth focus:outline-none focus:shadow-outline"
                                            placeholder='23859332162'
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.telefono}
                                        />

                                    </div>

                                    <input
                                        type='submit'
                                        className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
                                        value='Guardar Cliente'
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

export default EditarCliente;
