const SESSION_NAME_SPACE = 'userSession';

const Language = {
  vietnamese: 'vi',
  english: 'en',
};

const Countries = {
  VietNam: {
    name: 'Việt Nam',
    currency: 'VND',
  },
};

const CurrencySetting = {
  VND: {
    precision: 0,
  },
  USD: {
    precision: 2,
  },
};

const RoundingPaymentType = {
  NO_ROUND: 'NO_ROUND',
  ROUND: 'ROUND',
  FLOOR: 'FLOOR',
  CEIL: 'CEIL',
};

const Status = {
  enabled: 'enabled',
  disabled: 'disabled',
};

const OrderSessionDiscountType = {
  INVOICE: 'INVOICE',
  PRODUCT: 'PRODUCT',
};

const DiscountValueType = {
  PERCENTAGE: 'PERCENTAGE',
  ABSOLUTE: 'ABSOLUTE',
};

const PaymentMethod = {
  CASH: 'CASH',
  BANK_TRANSFER: 'BANK_TRANSFER',
};

module.exports = {
  SESSION_NAME_SPACE,
  Language,
  Countries,
  Status,
  CurrencySetting,
  RoundingPaymentType,
  OrderSessionDiscountType,
  DiscountValueType,
  PaymentMethod,
};
