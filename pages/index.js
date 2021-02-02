import Layout from "../components/Layout";
import {gql, useQuery} from "@apollo/client"
import { useRouter } from "next/router";
import Link from "next/link";
import Cliente from "../components/cliente";

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
const Index = () => {
    const router = useRouter();
    //Consulta de apollo
    const {data, loading, error} = useQuery(OBTENER_CLIENTE_USUARIO);
    if (loading) return (<h1>Cargando...</h1>);
    if(!data){
        router.push('/loggin')
    }

    return (
        <div>
            <Layout>
                <h1 className="text-2xl text-gray-800 font-light">Clientes</h1>
                <Link href='/nuevoCliente'>
                    <a className="w-full lg:w-auto text-center bg-blue-800 py-2 px-2 mt-3 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold">
                        Nuevo Cliente
                    </a>
                </Link>
                <div className="overflow-x-auto">
                    <table className="table-auto shadow-md mt-10 w-full w-lg">
                        <thead className="bg-gray-800">
                        <tr className="text-white">
                            <th className="w-1/5 py-1">Nombre</th>
                            <th className="w-1/5 py-1">Empresa</th>
                            <th className="w-1/5 py-1">Email</th>
                            <th className="w-1/5 py-1">Eliminar </th>
                            <th className="w-1/5 py-1">Editar </th>
                        </tr>
                        </thead>

                        <tbody className="bg-white">
                        {
                            data  ? data.obtenerClientesVendedor.map(cliente=>(
                                <Cliente key={cliente.id.toString()} cliente={cliente}/>
                            )) : null
                        }
                        </tbody>
                    </table>
                </div>
            </Layout>
        </div>
    )
}
export default Index;
