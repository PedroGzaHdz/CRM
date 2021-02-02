import Layout from "../components/Layout";
import Link from "next/link";
import ProductoItem from "../components/productItem"
import {gql, useQuery} from "@apollo/client";

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
const Productos = () => {
    //Consulta de apollo
    const {data, loading, error} = useQuery(OBTENER_PRODUCTOS);
    if (loading) return (<h1>Cargando...</h1>);
    if (!data) {
        router.push('/loggin')
    }
    const {obtenerProductos} = data;

    return (
        <div>
            <Layout>
                <h1 className="text-2xl text-gray-800 font-light">Productos</h1>
                <Link href='/nuevoProducto'>
                    <a className="bg-blue-800 py-2 px-2 mt-3 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold">
                        Nuevo Producto
                    </a>
                </Link>
                <div className="overflow-x-auto">
                    <table className="table-auto shadow-md mt-10 w-full w-lg">
                        <thead className="bg-gray-800">
                        <tr className="text-white">
                            <th className="w-1/5 py-1">Nombre</th>
                            <th className="w-1/5 py-1">Existencía</th>
                            <th className="w-1/5 py-1">Precio</th>
                            <th className="w-1/5 py-1">Eliminar</th>
                            <th className="w-1/5 py-1">Editar</th>
                        </tr>
                        </thead>

                        <tbody className="bg-white">
                        {
                            data ? obtenerProductos.map(product => (
                                <ProductoItem key={product.id.toString()} product={product}/>
                            )) : null
                        }
                        </tbody>
                    </table>
                </div>
            </Layout>
        </div>
    )
}
export default Productos
