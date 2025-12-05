import * as React from "react";

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  icon: string;
}

export declare const Icon: React.FC<IconProps>;
export default Icon;
