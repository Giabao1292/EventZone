const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p>
          © {new Date().getFullYear()} The Trinb TICKET. All rights reserved.
        </p>
        <p className="mt-2">
          <a href="/contact" className="hover:underline">
            Liên hệ
          </a>{" "}
          |{" "}
          <a href="/privacy" className="hover:underline">
            Chính sách bảo mật
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
