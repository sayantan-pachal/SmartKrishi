import React from 'react'

import Header from './component/Header/Header'
import Footer from './component/Footer/Footer'
import {Outlet} from 'react-router-dom'
import ScrollToTop from './ScrollToTop'

function Layout() {
    return (
        <dev>
            <Header />
            <ScrollToTop />
            <Outlet />
            <Footer />
        </dev>
    )
}

export default Layout