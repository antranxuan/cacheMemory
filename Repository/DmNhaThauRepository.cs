using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DocproPVEP.Customs.Params;
using DocproPVEP.Models.DATA;
using DocProUtil;

namespace DocproPVEP.Repository
{
    public class DmNhaThauRepository : DmNhaThau
    {

        public static List<DmNhaThau> Search(int idChannel, SearchParam param, Pagination paging)
        {

            try
            {
                var orderBy = "Created DESC";
                return Instance.GetListOrDefault(Instance.SqlBuilder(idChannel).WhereSearchMeta(param.Term), paging, orderBy);
            }
            catch (Exception ex)
            {
                Loger.Log(ex.ToString(), "DmNhaThau");
                return new List<DmNhaThau>();
            }
        }

        public static bool CheckCode(int idchannel, string Code, int id = 0)
        {
            return Instance.Exists(
                               Instance.SqlBuilder(idchannel)
                               .WhereIsTrue(id > 0, "ID<>@0", id)
                               .Where("MaNhaThau=@0", Code)
                               );
        }
    }
}