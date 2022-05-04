import { ConfigContext } from 'ultra-design/es/config-provider/config-provider';
import { useContext } from 'react';

export default function useUltraContext() {
  const ultraContext = useContext(ConfigContext);

  return ultraContext;
}
