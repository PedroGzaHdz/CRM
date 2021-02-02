import React, {useState} from "react"
import Layout from "../components/Layout";
import {useFormik} from "formik";
import * as Yup from "yup";
import {useQuery, useMutation, gql} from "@apollo/client";
import {useRouter} from "next/router";

const NUEVA_CUENTA = gql`
    mutation nuevoUsaurio($input: UsuarioInput ){
        nuevoUsuario(input: $input){
            id
            nombre
            apellido
            email
            creado
        }
    }

`

const NuevaCuenta = () => {

    // //Obtener productos de gql
    // const { data, loading, error} = useQuery(QUERY);
    // console.log(data,loading,error)
    //Validación de formulario

    //State de mensaje
    const  [mensaje,setMensaje] = useState(null);
    //Mutation para crear un nuevo usuario
    const [nuevoUsuario] = useMutation(NUEVA_CUENTA);
    const router = useRouter()
    const formik = useFormik({
        initialValues: {
            nombre: '',
            apellido: '',
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            nombre: Yup.string().required('El nombre es obligatorio'),
            apellido: Yup.string().required('El apellido es obligatorio'),
            email: Yup.string().email('Se requiere un formato de email').required('El email es obligatorio'),
            password: Yup.string().required('El password es obligatorio').min(6, 'El minimo de caracteres es de 6 ')
        }),
        onSubmit: async values => {
            try {
                const { data } = await nuevoUsuario(
                    {
                        variables: {
                            input: values
                        }
                    }
                )
                //Usuario agregado correctamente
                setMensaje(`Se creo correctamente el Usuario: ${data.nuevoUsuario.nombre}`)
                setTimeout(()=>{
                    setMensaje(null);
                    //Redirigis al usuario
                    router.push('/loggin')
                },3000)
            } catch (e) {
                setMensaje(e.message)
                setTimeout(()=>{
                    setMensaje(null)
                },3000)
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
            {mensaje && mostrarMensaje() }
            <h1 className="text-center text-2xl text-white font-light">Crear Nueva Cuenta</h1>
            <div className="flex justify-center mt-5">
                <div className="w-full max-w-sm">
                    <form
                        className="bg-white rounded shadow-md px-8 pt-6 pb-8 mt-4"
                        onSubmit={formik.handleSubmit}
                    >
                        <div className='mb-4'>
                            <label className="block text-gray-700 text-sm font-bold mb-2 " htmlFor='nombre'>
                                Nombre
                            </label>
                            <input
                                id='nombre'
                                className="shadow appearace-none border rounded w-full py-2 px-3 text-gray-700 leading-tigth focus:outline-none focus:shadow-outline"
                                placeholder='Nombre'
                                type="text"
                                value={formik.nombre}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
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
                                className="shadow appearace-none border rounded w-full py-2 px-3 text-gray-700 leading-tigth focus:outline-none focus:shadow-outline"
                                placeholder='Apellido'
                                type="text"
                                value={formik.apellido}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
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
                            <label className="block text-gray-700 text-sm font-bold mb-2 " htmlFor='email'>
                                Email
                            </label>
                            <input
                                id='email'
                                className="shadow appearace-none border rounded w-full py-2 px-3 text-gray-700 leading-tigth focus:outline-none focus:shadow-outline"
                                placeholder='Email'
                                value={formik.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
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
                            <label className="block text-gray-700 text-sm font-bold mb-2 " htmlFor='password'>
                                Password
                            </label>
                            <input
                                id='password'
                                type='password'
                                className="shadow appearace-none border rounded w-full py-2 px-3 text-gray-700 leading-tigth focus:outline-none focus:shadow-outline"
                                placeholder='password'
                                value={formik.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />

                        </div>

                        {
                            formik.touched.password && formik.errors.password ? (
                                <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 '>
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.password}</p>
                                </div>
                            ) : null
                        }
                        <input
                            type='submit'
                            className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900"
                            value="Crear Cuenta"
                        />
                    </form>
                </div>
            </div>
        </Layout>
    )
}
export default NuevaCuenta;
