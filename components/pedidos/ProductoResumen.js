import React from "react";
import PedidoContext from "../../context/pedidos/PedidoContext";
const ProductoResumen = ({ producto }) => {

    const { nombre, precio } = producto;
    const [cantidad, setCantidad] = React.useState(0);
    const pedidoContext = React.useContext(PedidoContext);
    const { cantidadProductos, actualizarTotal } = pedidoContext;

    React.useEffect(()=>{
        actualizarCantidad();
        actualizarTotal();
    },[cantidad]);

    const actualizarCantidad = () => {
        const nuevoProducto = {...producto, cantidad: Number(cantidad) };
        cantidadProductos(nuevoProducto);
    }

    return (
        <div className="md:flex md:justify-between md:items-center mt-5">
            <div className='md:w-2/4 mb-2 md:mb-0 '>
                <p className='text-sm'> {nombre}</p>
                <p>$ { precio } </p>
            </div>
            <input
                value={cantidad}
                type='number'
                placeholder='Cantidad'
                className='shadow apperance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline md:ml-4'
                onChange={(e) => setCantidad(e.target.value) }
            />
        </div>
    )
}
export default ProductoResumen;