export type CouponFormState = CouponFormStateIdle | CouponFormStateSubmitting;

interface CouponFormStateIdle {
	state: 'idle';
	coupon: {
		value: string;
		error?: 'empty';
	},
}

interface CouponFormStateSubmitting {
	state: 'submitting';
	coupon: {
		value: string;
	}
}

interface Coupon {
  amount: number;
  reason: string;
  activation: Date;
  expiration: Date;
}
