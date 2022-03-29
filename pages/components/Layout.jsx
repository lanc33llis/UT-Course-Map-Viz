import Header from "./Header"
import Footer from "./Footer"

const Layout = ({children}) => {
  return (
    <main id="app">
      <Header />
      {children}
      <Footer />
    </main>
  )
}

export default Layout