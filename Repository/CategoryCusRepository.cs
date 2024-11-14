using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DocProModel.Models;
using DocproPVEP.Customs.Params;
using DocProUtil;

namespace DocproPVEP.Repository
{
    public class CategoryCusRepository :Category
    {
        public static List<Category> AllDanhMuc(int idChannel, SearchParam param, Pagination paging)
        {
            try
            {
                var orderBy = "Created DESC";
                return Instance.GetListOrDefault(Instance.SqlBuilder(idChannel)
                        .WhereSearchMeta(param.Term)
                        , paging, orderBy);
            }
            catch (Exception ex)
            {
                Loger.Log(ex.ToString(), "Category");
                return new List<Category>();
            }
        }
        public static bool CheckCode(int idchannel,  string Code, int id = 0)
        {
            return Instance.Exists(
                               Instance.SqlBuilder(idchannel)
                               .WhereIsTrue(id > 0, "ID<>@0", id)
                               .Where("Code=@0", Code)
                               );
        }
    }
}