import config from '../../shared/config'


const Payment = {
	changeBusiness: qty => (config.businessPack.price * qty).toFixed(2),
	changeBusiness5: qty => (config.businessPack5.price * qty).toFixed(2),
	changeBusiness10: qty => (config.businessPack10.price * qty).toFixed(2),
	changeBusiness50: qty => (config.businessPack50.price * qty).toFixed(2),
	changeEmployee: qty => (config.employeePack.price * qty).toFixed(2),
	changeNotification: qty => (config.notificationPack.price * qty).toFixed(2),
	changeContractor: qty => (config.subcontractorPack.price * qty).toFixed(2)
}

export default Payment
