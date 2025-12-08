import { ZAlert, ZAlertProps } from "../ZAlert";

export type ZkAlertProps = ZAlertProps;

export function ZkAlert(props: ZAlertProps) {
  return <ZAlert tone="banner" {...props} />;
}
