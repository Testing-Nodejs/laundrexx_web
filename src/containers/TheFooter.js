import React from "react";
import { CFooter } from "@coreui/react";

const TheFooter = () => {
  return (
    <CFooter fixed={false}>
      <div className="mfs-auto">
        <span className="mr-1" style={{ color: "#000" }}>
          Product by
        </span>
        <a
          href="https://www.vssitcompany.com/"
          target="_blank"
          style={{ color: "#0056b3", fontWeight: 500 }}
          rel="noreferrer"
        >
          Veriteam Software Solutions
        </a>
      </div>
    </CFooter>
  );
};

export default React.memo(TheFooter);
