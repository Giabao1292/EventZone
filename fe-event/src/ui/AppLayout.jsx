import Header from "./Header";
import Footer from "./Footer";
import PropTypes from "prop-types";

const AppLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-gradient-to-br from-slate-100 to-slate-200">
        {children}
      </main>
      <Footer />
    </div>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppLayout;
