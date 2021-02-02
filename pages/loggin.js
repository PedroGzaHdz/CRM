import React, {useState} from "react";
import Layout from "../components/Layout";
import {useFormik} from "formik";
import * as Yup from "yup";
import {validateSchema} from "graphql";
import {gql, useMutation} from "@apollo/client";
import {useRouter} from "next/router";

const AUTENTICAR_USUARIO = gql`
    mutation autenticarUsuario($input: AutenticarInput ){
        autenticarUsuario(input: $input){
            token
        }
    }
`

const Loggin = () => {


    //State de mensaje
    const [mensaje, setMensaje] = useState(null);
    const [autenticarUsuario] = useMutation(AUTENTICAR_USUARIO);
    const router = useRouter()
    const formik = useFormik(
        {
            initialValues: {
                email: '',
                password: ''
            },
            validationSchema: Yup.object(
                {
                    email: Yup.string().email('El email no es válido').required('El email no puede ir vacío'),
                    password: Yup.string().required('La contraseña es obligatoría')
                }
            ),
            onSubmit: async values => {
                try {
                    const {data} = await autenticarUsuario({
                        variables: {
                            input: {
                                ...values
                            }
                        }
                    })
                    setTimeout(() => {
                        localStorage.setItem('token', data.autenticarUsuario.token)
                    },1000);
                    setMensaje('Autenticado ...');

                    setTimeout(() => {
                        setMensaje(null);
                        router.push('/')
                    }, 2000)

                } catch (e) {
                    setMensaje(e.message)
                    setTimeout(() => {
                        setMensaje(null)
                    }, 3000)
                }
            }
        }
    );
    const mostrarMensaje = () => {
        return (
            <div className='bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto'>
                <p>{mensaje}</p>
            </div>
        )
    }
    return (
        <>

            <Layout>
                <h1 className="text-center text-2xl text-white font-light">Loggin</h1>
                {mensaje && mostrarMensaje()}
                <div className="flex justify-center mt-5">
                    <div className="w-full max-w-sm">
                        <form
                            className="bg-white rounded shadow-md px-8 pt-6 pb-8 mt-4"
                            onSubmit={formik.handleSubmit}
                        >
                            {
                                formik.touched.email && formik.errors.email ? (
                                    <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 '>
                                        <p className="font-bold">Error</p>
                                        <p>{formik.errors.email}</p>
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
                                    placeholder='Usuario'
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.email}
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
                            <div className='mb-4'>
                                <label className="block text-gray-700 text-sm font-bold mb-2 " htmlFor='password'>
                                    Password
                                </label>
                                <input
                                    id='password'
                                    type='password'
                                    className="shadow appearace-none border rounded w-full py-2 px-3 text-gray-700 leading-tigth focus:outline-none focus:shadow-outline"
                                    placeholder='password'

                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.password}
                                />

                            </div>

                            <input
                                type='submit'
                                className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900"
                                value="Iniciar Sesión"
                            />
                        </form>
                    </div>
                </div>
            </Layout>
        </>

    )
}
export default Loggin;