import React from 'react'

import Header from './component/Header/Header'
import Footer from './component/Footer/Footer'
import { Outlet } from 'react-router-dom'
import ScrollToTop from './ScrollToTop'

function Layout() {
    return (
        <div>
            <Header />
            <ScrollToTop />
            <main className="flex-1 min-h-screen bg-smartkrishi-light dark:bg-smartkrishi-dark">
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}

export default Layout