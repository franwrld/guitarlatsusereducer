import { useState, useEffect, useMemo } from "react"
import type { Guitar, CartItem } from '../types'

import { db } from '../data/db'

export const useCart = () => {

    const initialCart = () : CartItem[] => {
        const localStorageCart = localStorage.getItem('cart')
        return localStorageCart ? JSON.parse(localStorageCart) : []
    }
    
    const [data] = useState(db)
    const [cart, setCart] = useState(initialCart)
    
    const MAX_ITEMS = 5
    const MIN_ITEMS = 1
    
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart))
    }, [cart])
    
    function addToCart(item : Guitar) {
    
    const itemExists = cart.findIndex(guitar => guitar.id === item.id)
    if(itemExists >= 0) { //Existe en el carrito
        if(cart[itemExists].cantidad >= MAX_ITEMS) return
        // updatedCart para no mutar el state original
        const updatedCart = [...cart]
        updatedCart[itemExists].cantidad++
        setCart(updatedCart)
    } else {
        const newItem : CartItem = {...item, cantidad : 1}
        setCart([...cart, newItem])
      }
    }
    
    function removeFromCart(id : Guitar['id']) {
        setCart(prevCart => prevCart.filter(guitar => guitar.id !== id))
    }
    
    function incrementarCantidad(id : Guitar['id']) {
        const updatedCart = cart.map( item => {
          if(item.id === id && item.cantidad < MAX_ITEMS) {
            return {
              ...item,
              cantidad: item.cantidad + 1
            }
          }
          return item
        })
        setCart(updatedCart)
    }
    
    function reducirCantidad(id : Guitar['id']) {
        const updatedCart = cart.map( item => {
          if(item.id === id && item.cantidad > MIN_ITEMS) {
            return {
              ...item,
              cantidad: item.cantidad - 1
            }
          }
          return item
        })
        setCart(updatedCart)
    }
    
    function limpiarCart () {
        setCart([])
    }

        // State derivado
        const isEmpty = useMemo( () => cart.length === 0, [cart])
        const cartTotal = useMemo( () => cart.reduce((total, item) => total + (item.cantidad * item.price), 0), [cart])
    

    return {
        data,
        cart,
        addToCart,
        removeFromCart,
        incrementarCantidad,
        reducirCantidad,
        limpiarCart,
        isEmpty,
        cartTotal
    }

}