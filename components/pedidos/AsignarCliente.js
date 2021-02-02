import React from "react";
import Select from "react-select";
import { gql, useQuery } from "@apollo/client";
import PedidoContext from "../../context/pedidos/PedidoContext";

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

const AsignarCliente = () => {
    const [cliente, setClientes] = React.useState();
    const pedidoContext = React.useContext(PedidoContext);
    // Datos Context
    const { agregarCliente  } = pedidoContext;
    React.useEffect(()=>{
        agregarCliente(cliente)
    },[cliente])
    //Consultar a la basa de datos
    const { data, loading, error } = useQuery(OBTENER_CLIENTE_USUARIO);
    if (loading) return null;
    const { obtenerClientesVendedor } = data;
    return (
        <>
            <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">
                1.- Asigna un cliente al pedido
            </p>
            <Select
                className="mt-3"
                options={ obtenerClientesVendedor }
                getOptionValue = { (opciones) => opciones.id }
                getOptionLabel = { opciones => opciones.nombre}
                noOptionsMessage = { ()=> "No hay resultados"}
                onChange={ result => setClientes(result)}
            />
        </>
    )
}

export default AsignarCliente;