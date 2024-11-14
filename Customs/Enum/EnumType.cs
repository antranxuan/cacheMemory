using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace DocproPVEP.Customs.Enum
{
    public enum TrangThaiHoChieu
    {
        [Description("Còn hạn")]
        ConHan = 1,
        [Description("Hết hạn")]
        HetHan = 2,
        [Description("Hủy")]
        Huy = 3,

    }

}