import React from "react";
import "../styles/auth.scss";

export default function AuthLayout({ title, children, footer }) {
  return (
    <div className="auth">
      <div className="auth__card">
        <h1 className="auth__title">{title}</h1>
        {children}
        {footer && <div className="auth__footer">{footer}</div>}
      </div>
    </div>
  );
}
