import { Routes, Route } from 'react-router-dom'
import Layout from '@/components/Layout'
import CookieConsent from '@/components/CookieConsent'
import Home from '@/pages/Home'
import Shop from '@/pages/Shop'
import ProductDetail from '@/pages/ProductDetail'
import Cart from '@/pages/Cart'
import Checkout from '@/pages/Checkout'
import Confirmation from '@/pages/Confirmation'
import About from '@/pages/About'
import Contact from '@/pages/Contact'

export default function App() {
  return (
    <>
      <CookieConsent />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/"            element={<Home />} />
          <Route path="/shop"        element={<Shop />} />
          <Route path="/shop/:id"    element={<ProductDetail />} />
          <Route path="/cart"        element={<Cart />} />
          <Route path="/checkout"    element={<Checkout />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/about"       element={<About />} />
          <Route path="/contact"     element={<Contact />} />
        </Route>
      </Routes>
    </>
  )
}
