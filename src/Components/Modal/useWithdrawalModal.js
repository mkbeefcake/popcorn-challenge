import { useState } from 'react';

const useWithdrawalModal = () => {
  const [isWithdrawShowing, setIsWithdrawShowing] = useState(false);

  function toggleWithdraw() {
    setIsWithdrawShowing(!isWithdrawShowing);
  }

  return {
    isWithdrawShowing,
    toggleWithdraw,
  }
};

export default useWithdrawalModal;