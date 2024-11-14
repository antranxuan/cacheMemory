using DocProUtil;
using DocProUtil.Cf;
using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;
using System.Web.Mvc;

namespace DocproPVEP.Controllers
{
    public class ThumbController : Controller
    {
        //
        // GET: /Thumb/
        public ActionResult Index(string w, string h, string path)
        {
            var thumbF = string.Format("thumb/{0}x{1}", w, h);
            var pathThumb = Path.Combine(
                GlobalConfig.StgBase,
                Utils.RealPath(thumbF),
                Utils.RealPath(path)
            );

            if (Utils.IsFileExists(pathThumb))
            {
                return Utils.AccessNAS<FileContentResult>(pathThumb, () =>
                {
                    return File(System.IO.File.ReadAllBytes(pathThumb), "image/png");
                });
            }
                

            var pathSource = Path.Combine(
                GlobalConfig.StgDirFile,
                Utils.RealPath(path)
            );
            
            if (!Utils.IsFileExists(pathSource))
                return HttpNotFound();

            var width = 0;
            var height= 0;
            if (Utils.IsNumber(w))
                width = int.Parse(w);
            if (Utils.IsNumber(h))
                height = int.Parse(h);
            if (width == 0 && height == 0)
                return HttpNotFound();

            try
            {
                return Utils.AccessNAS<FileContentResult>(pathSource, () =>
                {
                    using (FileStream fs = new FileStream(pathSource, FileMode.Open, FileAccess.Read, FileShare.ReadWrite))
                    {
                        var image = Image.FromStream(fs);
                        foreach (var prop in image.PropertyItems)
                        {
                            if ((prop.Id == 0x0112 || prop.Id == 5029 || prop.Id == 274))
                            {
                                var value = (int)prop.Value[0];
                                if (value == 6)
                                {
                                    image.RotateFlip(RotateFlipType.Rotate90FlipNone);
                                    break;
                                }
                                else if (value == 8)
                                {
                                    image.RotateFlip(RotateFlipType.Rotate270FlipNone);
                                    break;
                                }
                                else if (value == 3)
                                {
                                    image.RotateFlip(RotateFlipType.Rotate180FlipNone);
                                    break;
                                }
                            }
                        }

                        var srcWidth = image.Width;
                        var srcHeight = image.Height;

                        int thumbWidth;
                        int thumbHeight;

                        if (width > 0 && height > 0)
                        {
                            thumbWidth = width;
                            thumbHeight = height;
                        }
                        else if (width > 0)
                        {
                            thumbWidth = width;
                            if (srcHeight > srcWidth)
                                thumbHeight = (int)Math.Round((srcHeight / (decimal)srcWidth) * thumbWidth);
                            else
                            {
                                thumbHeight = thumbWidth;
                                thumbWidth = (int)Math.Round((srcWidth / (decimal)srcHeight) * thumbHeight);
                            }
                        }
                        else
                        {
                            thumbHeight = height;
                            if (srcHeight > srcWidth)
                                thumbWidth = (int)Math.Round((srcHeight / (decimal)srcWidth) * thumbHeight);
                            else
                            {
                                thumbWidth = thumbHeight;
                                thumbHeight = (int)Math.Round((srcWidth / (decimal)srcHeight) * thumbWidth);
                            }
                        }
                        using (var bmp = new Bitmap(thumbWidth, thumbHeight))
                        {
                            using (var gr = Graphics.FromImage(bmp))
                            {
                                gr.SmoothingMode = SmoothingMode.Default;
                                gr.CompositingQuality = CompositingQuality.HighSpeed;
                                gr.InterpolationMode = InterpolationMode.Default;
                                gr.FillRectangle(new SolidBrush(Color.White), new Rectangle(0, 0, thumbWidth, thumbHeight));
                                gr.DrawImage(image, new Rectangle(0, 0, thumbWidth, thumbHeight), 0, 0, srcWidth, srcHeight, GraphicsUnit.Pixel);
                            }
                            var dirname = Path.GetDirectoryName(pathThumb);
                            if (dirname != null)
                                Directory.CreateDirectory(dirname);

                            bmp.Save(pathThumb, ImageFormat.Jpeg);
                            return File(System.IO.File.ReadAllBytes(pathThumb), "image/jpeg");
                        }
                    }
                });
            }
            catch(Exception ex)
            {
                Loger.Log(ex);
                return HttpNotFound();
            }

        }

    }
}
