import React from "react";
import Select from "react-select";
import {gql, useQuery} from "@apollo/client";
import PedidoContext from "../../context/pedidos/PedidoContext";

const OBTENER_PRODUCTOS = gql`

query obtenerProductos{
    obtenerProductos{
        id
        nombre
        existencia
        precio
        creado
    }
}
`

const AsignarProductos = () => {
    const [productos, setProductos] = React.useState();
    const pedidoContext = React.useContext(PedidoContext);
    // Datos Context
    const {agregarProductos} = pedidoContext;
    React.useEffect(() => {
        agregarProductos(productos)
    }, [productos])
    //Consultar a la basa de datos
    const {data, loading, error} = useQuery(OBTENER_PRODUCTOS);
    if (loading) return null;
    const { obtenerProductos } = data;
    return (
        <>
            <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">
                2.- Selecciona o Busca los productos
            </p>
            <Select
                className="mt-3"
                options={obtenerProductos}
                isMulti= 'true'
                getOptionValue={(opciones) => opciones.id}
                getOptionLabel={opciones => `${opciones.nombre} - ${opciones.existencia} Disponibles`}
                noOptionsMessage={() => "No hay resultados"}
                onChange={result => setProductos(result)}
            />
        </>
    )
}

export default AsignarProductos;