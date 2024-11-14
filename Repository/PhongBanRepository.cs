using DocproPVEP.Customs.Params;
using DocproPVEP.Models.DATA;
using DocProUtil;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DocproPVEP.Repository
{
    public class PhongBanRepository:PhongBan
    {
        public static List<PhongBan> GetAll(int idChanel)
        {
            try
            {
                return Instance.GetListOrDefault(Instance.SqlBuilder(idChanel).Where(
                "ID<>@0", 0));
            }
            catch(Exception ex)
            {
                Loger.Log(ex.ToString(), "PhongBan");
                return new List<PhongBan>();
            }
        }
    }
}