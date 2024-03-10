using System.Net;
using System.Text;
using System.Text.Json;

class Program
{
  public static void Main()
  {
    Record[] records = [];

    HttpListener listener = new();
    listener.Prefixes.Add("http://*:5000/");
    listener.Start();

    Console.WriteLine("Server started. Listening for requests...");
    Console.WriteLine("Main page on http://localhost:5000/website/index.html");

    while (true)
    {
      HttpListenerContext context = listener.GetContext();
      HttpListenerRequest request = context.Request;
      HttpListenerResponse response = context.Response;

      string rawPath = request.RawUrl!;
      string absPath = request.Url!.AbsolutePath;

      Console.WriteLine($"Received a request with path: " + rawPath);

      string filePath = "." + absPath;
      bool isHtml = request.AcceptTypes!.Contains("text/html");

      if (File.Exists(filePath))
      {
        byte[] fileBytes = File.ReadAllBytes(filePath);
        if (isHtml) { response.ContentType = "text/html; charset=utf-8"; }
        response.OutputStream.Write(fileBytes);
      }
      else if (isHtml)
      {
        response.StatusCode = (int)HttpStatusCode.Redirect;
        response.RedirectLocation = "/website/404.html";
      }
      else if (absPath == "/addRecord")
      {
        string recordJson = GetBody(request);
        Console.WriteLine(recordJson);
        Record record = JsonSerializer.Deserialize<Record>(recordJson)!;

        int pos = FindPosition(records, record);
        records = [.. records[..pos], record, .. records[pos..]];
      }
      else if (absPath == "/getRecords")
      {
        string recordsJson = JsonSerializer.Serialize(records);
        byte[] recordsBytes = Encoding.UTF8.GetBytes(recordsJson);
        response.OutputStream.Write(recordsBytes);
      }

      response.Close();
    }
  }

  public static int FindPosition(Record[] records, Record record)
  {
    for (int i = 0; i < records.Length; i++)
    {
      if (records[i].Score < record.Score)
      {
        return i;
      }
    }

    return records.Length;
  }

  public static string GetBody(HttpListenerRequest request)
  {
    return new StreamReader(request.InputStream).ReadToEnd();
  }
}

class Record(string name, int score)
{
  public string Name { get; set; } = name;
  public int Score { get; set; } = score;
}