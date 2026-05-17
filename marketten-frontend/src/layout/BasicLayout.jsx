import Footer from './Footer';
import Header from './Header';

const BasicLayout = ({ children }) => {
  return (
    <div className="wrapper flex flex-col h-screen">
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
};

export default BasicLayout;
