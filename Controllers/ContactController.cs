using Microsoft.AspNetCore.Mvc;
using System.Net.Mail;
using System.Net;

namespace FolderApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContactController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public ContactController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost]
        public async Task<IActionResult> SendContactMessage([FromBody] ContactMessage message)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(message.Name) || 
                    string.IsNullOrWhiteSpace(message.Email) || 
                    string.IsNullOrWhiteSpace(message.Message))
                {
                    return BadRequest("Nome, email e mensagem são obrigatórios.");
                }

                // Configurações do email (você precisará configurar essas informações)
                var smtpServer = _configuration["Email:SmtpServer"] ?? "smtp.gmail.com";
                var smtpPort = int.Parse(_configuration["Email:SmtpPort"] ?? "587");
                var smtpUsername = _configuration["Email:Username"];
                var smtpPassword = _configuration["Email:Password"];
                var fromEmail = _configuration["Email:FromEmail"] ?? smtpUsername;
                var toEmail = _configuration["Email:ToEmail"] ?? "personal@example.com";

                if (string.IsNullOrEmpty(smtpUsername) || string.IsNullOrEmpty(smtpPassword))
                {
                    // Se não houver configuração de email, apenas loga a mensagem
                    var logMessage = $"Nova mensagem de contato:\n" +
                                   $"Nome: {message.Name}\n" +
                                   $"Email: {message.Email}\n" +
                                   $"Telefone: {message.Phone ?? "Não informado"}\n" +
                                   $"Mensagem: {message.Message}\n" +
                                   $"Data: {DateTime.Now:dd/MM/yyyy HH:mm:ss}";

                    // Salva em arquivo de log
                    var logPath = Path.Combine(Directory.GetCurrentDirectory(), "contact_logs.txt");
                    await System.IO.File.AppendAllTextAsync(logPath, logMessage + "\n\n");

                    return Ok(new { message = "Mensagem recebida com sucesso! Entraremos em contato em breve." });
                }

                // Envia o email
                using (var client = new SmtpClient(smtpServer, smtpPort))
                {
                    client.UseDefaultCredentials = false;
                    client.Credentials = new NetworkCredential(smtpUsername, smtpPassword);
                    client.EnableSsl = true;

                    var mailMessage = new MailMessage
                    {
                        From = new MailAddress(fromEmail, "Sistema de Contato"),
                        Subject = $"Nova mensagem de contato - {message.Name}",
                        Body = $@"
                            <h2>Nova mensagem de contato recebida</h2>
                            <p><strong>Nome:</strong> {message.Name}</p>
                            <p><strong>Email:</strong> {message.Email}</p>
                            <p><strong>Telefone:</strong> {message.Phone ?? "Não informado"}</p>
                            <p><strong>Mensagem:</strong></p>
                            <p>{message.Message.Replace("\n", "<br>")}</p>
                            <p><strong>Data:</strong> {DateTime.Now:dd/MM/yyyy HH:mm:ss}</p>
                        ",
                        IsBodyHtml = true
                    };

                    mailMessage.To.Add(toEmail);

                    await client.SendMailAsync(mailMessage);
                }

                return Ok(new { message = "Mensagem enviada com sucesso! Entraremos em contato em breve." });
            }
            catch (Exception ex)
            {
                // Log do erro
                var errorLog = $"Erro ao enviar mensagem: {ex.Message}\nData: {DateTime.Now:dd/MM/yyyy HH:mm:ss}\n\n";
                var logPath = Path.Combine(Directory.GetCurrentDirectory(), "error_logs.txt");
                await System.IO.File.AppendAllTextAsync(logPath, errorLog);

                return StatusCode(500, new { message = "Erro interno do servidor. Tente novamente mais tarde." });
            }
        }
    }

    public class ContactMessage
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string Message { get; set; } = string.Empty;
    }
} 