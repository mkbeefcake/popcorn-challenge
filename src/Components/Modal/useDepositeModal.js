import { useState } from 'react';

const useDepositeModal = () => {
  const [isDepositeShowing, setIsDepositeShowing] = useState(false);

  function toggleDeposite() {
    setIsDepositeShowing(!isDepositeShowing);
  }

  return {
    isDepositeShowing,
    toggleDeposite,
  }
};

export default useDepositeModal;