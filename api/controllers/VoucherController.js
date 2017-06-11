/**
 * VoucherController
 *
 * @description :: Server-side logic for managing vouchers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 module.exports = {
    validate:function (req,res) {
        if (!req.body) {
          return res.badRequest( 'you must pass all parameters: email name ');
      } else {
        v=req.body;
        Voucher.findOne({code:v.code})
        .then(function (voucher) {
            if(voucher){
                if(voucher.active){
                    if((voucher.zone && voucher.zone ===v.zone) || !voucher.zone ){
                        Sale.find({costumer:v.user,voucher:voucher.id})
                        .then(function(sales) {
                            if(sales.length<=0){
                                return res.json(voucher);
                            }else{
                                return res.json({err:04,msg:'USER_LIMIT'});
                            }
                        })
                    }else{
                        return res.json({err:03,msg:'ZONE_INVALID'});
                    }
                }else{
                    return res.json({err:02,msg:'VOUCHER_EXPIRED'});
                }
            }else{
                return res.json({err:01,msg:'NOT_FOUND'});
            }
        })
    }
}
};

