import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/auth/Login'
import ProtectedLayout from './layouts/ProtectedLayout'
import AdminDashboard from './pages/admin/AdminDashboard'

import CategoryList from './pages/inventory/CategoryList'
import ProductList from './pages/inventory/ProductList'
import PurchaseList from './pages/inventory/PurchaseList'
import SalesPOS from './pages/sales/SalesPOS'
import UserList from './pages/users/UserList'
import InventoryManagerDsahboard from './pages/inventoryManager/InventoryManagerDsahboard'

function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login/>} />
        <Route element={<ProtectedLayout />}>
          

          {/* Admin Route */}
          <Route path='/admin/dashboard' element={< AdminDashboard />} />
          <Route path='/inventory/dashboard' element={<InventoryManagerDsahboard />} />
          {/* <Route path='/sales/dashboard' element={< SalesDashboard/>} /> */}
          {/* Inventory - Categories */}
            <Route
              path="/inventory/categories"
              element={
                  <CategoryList />
                }
            />
            <Route
              path="/inventory/products"
              element={
                < ProductList />
              }
            />    
            <Route 
              path="/inventory/purchase"
              element={< PurchaseList />}
            />
            <Route 
              path="/sales"
              element={<SalesPOS/>}
            />
            <Route 
              path="/users"
              element={<UserList/>}
            />

          </Route>
          
             
      </Routes>
    </BrowserRouter>
  )
}

export default App
