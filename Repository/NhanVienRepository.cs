using DocproPVEP.Customs.Params;
using DocproPVEP.Models.DATA;
using DocProUtil;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DocproPVEP.Repository
{
    public class NhanVienRepository:NhanVien
    {
        public static List<NhanVien> Search(int idChannel, SearchParam param, Pagination paging)
        {

            try
            {
                var orderBy = "ID DESC";
                return Instance.GetListOrDefault(Instance.SqlBuilder(idChannel).WhereSearchMeta(param.Term).WhereIsTrue(param.Position!=0,"IDPhongBan=@0", param.Position), paging, orderBy);
            }
            catch (Exception ex)
            {
                Loger.Log(ex.ToString(), "NhanVien");
                return new List<NhanVien>();
            }
        }

        public static bool CheckCodePhone(int idchannel, string phone)
        {
            return Instance.Exists(
                               Instance.SqlBuilder(idchannel)
                               .Where("Phone=@0", phone)
                               );
        }
        //public static bool CheckCodePhoneUpdate(int idchannel, string newphone, string oldphone)
        //{
        //    return Instance.Exists(
        //                       Instance.SqlBuilder(idchannel)
        //                       .Where("Phone=@0", newphone)
        //                       .Where("Phone<>@0", oldphone)
        //                       );
        //}
        public static bool CheckCodePhoneUpdate(int idchannel, string currentPhone, string newPhone)
        {
            Loger.Log(currentPhone , "logNewPhone");
            if (currentPhone.Equals(newPhone))
            {
                return true;
            }
            //var isExists = sql.Where(p => p.Phone == newPhone).FirstOrDefault();
             var isExit= Instance.Exists(
                               Instance.SqlBuilder(idchannel)
                               .Where("phone = @0", newPhone)
                               );
         
            return isExit;
            
        }


    }
}