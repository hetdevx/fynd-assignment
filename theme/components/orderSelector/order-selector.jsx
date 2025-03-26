import React, { useState } from 'react';
import './OrderTypeSelector.less';

const OrderTypeSelector = () => {
  const [selectedOption, setSelectedOption] = useState('delivery');

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  return (
    <div className="order-type-selector">
      <button 
        className={`option-button ${selectedOption === 'delivery' ? 'selected' : ''}`}
        onClick={() => handleOptionClick('delivery')}
      >
        Delivery
      </button>
      <button 
        className={`option-button ${selectedOption === 'takeaway' ? 'selected' : ''}`}
        onClick={() => handleOptionClick('takeaway')}
      >
        Takeaway
      </button>
      <button 
        className={`option-button ${selectedOption === 'dine-in' ? 'selected' : ''}`}
        onClick={() => handleOptionClick('dine-in')}
      >
        Dine-in
      </button>
    </div>
  );
};

export default OrderTypeSelector;