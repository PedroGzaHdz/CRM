import React, { useContext } from "react";
import Layout from "../components/Layout";
import AsignarCliente from "../components/pedidos/AsignarCliente";

/// constect de pedido
import PedidoContext from "../context/pedidos/PedidoContext";
import AsignarProductos from "../components/pedidos/AsignarProductos";
import ResumenPedido from "../components/pedidos/ResumenPedido";
import Total from "../components/pedidos/Total";
import {gql, useMutation} from "@apollo/client";
import { useRouter } from "next/router";
import Swal from "sweetalert2";

const NUEVO_PEDIDO = gql`
    mutation nuevoPedido($input: PedidoInput){
      nuevoPedido(input: $input){
        id
      }
    }
`

const OBTENER_PEDIDOS = gql`

   query obtenerPedidosVendedor {
        obtenerPedidosVendedor {
            id
            pedido {
                id
                cantidad
                nombre
                precio
            }
            cliente {
                id
                nombre
                apellido
                email
                telefono
            }
            vendedor
            total
            estado
        }    
   }
`

const NuevoPedido= () => {

    const router = useRouter();
    // Utilizart context y extraer valores
    const pedidoContext = useContext(PedidoContext);
    const { total, productos, cliente } = pedidoContext;
    const [mensaje,setMensaje] = React.useState(null);
    /// Mutatuion para crear un nuevo pedido

    const [nuevoPedido] = useMutation(NUEVO_PEDIDO,{
        update(cache, {
            data: {
                nuevoPedido
            }
        }) {
            // Obtener ekl objeto del cache que deseamos actualizar
            const {obtenerPedidosVendedor} = cache.readQuery({query: OBTENER_PEDIDOS});
            // Rescribit el cache no se debe mutar
            cache.writeQuery({
                query: OBTENER_PEDIDOS,
                data: {
                    obtenerPedidosVendedor: [
                        ...obtenerPedidosVendedor,
                        nuevoPedido
                    ]
                }
            })
        }
    });

    const validarPedido = () => {
        return !productos?.every( producto => producto.cantidad > 0 ) ||  total == 0 || !cliente  ? 'opacity-50 cursor-not-allowed '  : '';
    }
    const mostrarMensaje = () => {
        return (
            <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto ">
                <p>{mensaje}</p>
            </div>
        )
    }
    const crearNuevoPedido = async () => {
        /// remover lo exyra de productos
        const pedido = productos.map(({__typename,existencia,creado,...producto})=>  producto);
        const { id }  = cliente;
        try {
            const {  data } = await nuevoPedido({
                variables: {
                    input : {
                        cliente: id,
                        total,
                        pedido
                    }
                }
            });
            //Redireccionar

            router.push('/pedidos')
            /// Mostrar mensaje
            Swal.fire(
                'Correcto',
                'El pedido se registro correctamente',
                "success"
            )

        }catch (e) {
            setMensaje(e.message.replace('GraphQL error: ', ''));
            setTimeout(()=>{
                setMensaje(null)
            },3000)
        }
    }
    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light"> Crear Nuevo Pedido</h1>
            {mensaje && mostrarMensaje()}
            <div className='flex justify-center mr-5'>
                <div className="w-full max-w-lg">
                    <AsignarCliente />
                    <AsignarProductos />
                    <ResumenPedido/>
                    <Total/>
                    <button
                        type='button'
                        className={`
                        bg-gray-800 w-full mt-5 p-2 
                        text-white uppercase font-bold
                         hover:bg-gray-900
                          ${validarPedido()}
                         `}

                        onClick={crearNuevoPedido}
                    >
                        Registrar Pedido
                    </button>
                </div>
            </div>
        </Layout>
    )
}

export default NuevoPedido;

