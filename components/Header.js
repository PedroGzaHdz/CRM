import React from "react";
import {useQuery, gql} from "@apollo/client";
import { useRouter } from "next/router"
const OBTENER_USUARIO = gql`
    query obtnerUsuario{
        obtenerUsuario {
            id
            nombre
            apellido
        }
    }`;

const Header = props => {
    const router = useRouter()
    // Query apoloo
    const {data, loading, error} = useQuery(OBTENER_USUARIO);
    // Protejer que no accedamos a data antes de tener el resultado
    if (loading) return null
    const {apellido, nombre} = data.obtenerUsuario;

    // Si no hay infomración
    if(!data.obtenerUsuario){
        return router.push('/loggin')
    }

    const cerrarSesion = () => {
        localStorage.removeItem('token');
        router.push('/loggin')
    }
    return (
        <div className="sm:flex justify-between mb-6">
            <p className="mr-2 mb-5 lg:mb-0 ">Hola: {nombre} {apellido}</p>
            <button type='button'
                    onClick={()=> cerrarSesion()}
                    className="bg-blue-800 w-full sm:w-auto font-bold uppercase text-xs rounded py-1 px-2 text-white shadow-md">
                Cerrar Sesión
            </button>
        </div>
    )
}
export default Header
