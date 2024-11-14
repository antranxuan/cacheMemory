using DocProModel.Models;

namespace DocproPVEP.Customs.Entities
{
    public class BlockEntity
    {
        public Block Block { get; set; }
        public dynamic Data { get; set; }
        public string Path { get; set; }
        public string Partial { get; set; }
        public string CssBlock { get; set; }
    }
}