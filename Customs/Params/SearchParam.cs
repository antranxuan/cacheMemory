namespace DocproPVEP.Customs.Params
{
    public class SearchParam
    {
        public int ID { get; set; }
        public int IDChannel { get; set; }
        public int Type { get; set; }
        public int Position { get; set; }
        public bool PendingApproval { get; set; }
        public bool PendingPublish { get; set; }
        public string Term { get; set; }
        public string Content { get; set; }
        public int[] IDNotIn { get; set; }

        public bool IsParams()
        {
            if (Type > 0)
                return true;
            if (Position > 0)
                return true;
            if (!string.IsNullOrEmpty(Term))
                return true;
            if (!string.IsNullOrEmpty(Content))
                return true;

            return false;
        }
    }
}