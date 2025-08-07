using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace FolderApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly string contentFilePath = Path.Combine(Directory.GetCurrentDirectory(), "site-content.json");

        [HttpGet("content")]
        public IActionResult GetContent()
        {
            try
            {
                if (System.IO.File.Exists(contentFilePath))
                {
                    var content = System.IO.File.ReadAllText(contentFilePath);
                    return Ok(JsonSerializer.Deserialize<object>(content));
                }

                // Retornar conteúdo padrão se não existir arquivo
                var defaultContent = new
                {
                    name = "Tamy Niwa",
                    title = "Personal Trainer Profissional",
                    description = "Transforme seu corpo e sua vida com treinos personalizados e acompanhamento especializado",
                    about = new[]
                    {
                        "Treinos, motivação, lifestyle CF LV1 trainer Cwb gymnastic LV1 Liberacao Miofascia.",
                        "Allan Joseph X-mobillity - mobilidade",
                        "Pós graduação: Alta Performance em Prescrição de Treinos e Exercícios: Hipertrofia, Saúde e Emagrecimento",
                        "\"Manter o corpo em boa saúde é um dever… caso contrário, não seremos capazes de manter nossa mente forte e clara\".  - Buda"
                    },
                    services = new[]
                    {
                        new
                        {
                            title = "Treino Presencial",
                            description = "Acompanhamento individualizado com treinos personalizados na academia ou ao ar livre.",
                            features = new[] { "Avaliação física completa", "Treinos personalizados", "Acompanhamento nutricional básico", "Suporte via WhatsApp" }
                        },
                        new
                        {
                            title = "Treino Online",
                            description = "Treinos personalizados para você fazer em casa ou na academia com acompanhamento remoto.",
                            features = new[] { "Treinos personalizados", "Vídeos explicativos", "Acompanhamento semanal", "Suporte 24/7" }
                        },
                        new
                        {
                            title = "Consultoria",
                            description = "Orientação especializada para otimizar seus treinos e resultados.",
                            features = new[] { "Análise de treinos", "Dicas de nutrição", "Planejamento de metas", "Suporte por 30 dias" }
                        }
                    },
                    contact = new
                    {
                        whatsapp = "(11) 99999-9999",
                        instagram = "@tamyniwa_personal",
                        email = "tamyniwa@gmail.com"
                    },
                    stats = new
                    {
                        clients = "100+",
                        experience = "5+",
                        commitment = "100%"
                    }
                };

                return Ok(defaultContent);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro ao carregar conteúdo", error = ex.Message });
            }
        }

        [HttpPut("content")]
        public IActionResult UpdateContent([FromBody] object content)
        {
            try
            {
                // Validar token (simplificado para demonstração)
                var authHeader = Request.Headers["Authorization"].FirstOrDefault();
                if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
                {
                    return Unauthorized(new { message = "Token de autenticação necessário" });
                }

                // Salvar conteúdo em arquivo JSON
                var jsonContent = JsonSerializer.Serialize(content, new JsonSerializerOptions
                {
                    WriteIndented = true
                });

                System.IO.File.WriteAllText(contentFilePath, jsonContent);

                // Log da alteração
                var logMessage = $"Conteúdo atualizado em {DateTime.Now:dd/MM/yyyy HH:mm:ss}\n";
                var logPath = Path.Combine(Directory.GetCurrentDirectory(), "admin_logs.txt");
                System.IO.File.AppendAllText(logPath, logMessage);

                return Ok(new { message = "Conteúdo atualizado com sucesso" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro ao salvar conteúdo", error = ex.Message });
            }
        }

        [HttpGet("messages")]
        public IActionResult GetMessages()
        {
            try
            {
                var contactLogPath = Path.Combine(Directory.GetCurrentDirectory(), "contact_logs.txt");
                if (System.IO.File.Exists(contactLogPath))
                {
                    var messages = System.IO.File.ReadAllText(contactLogPath);
                    return Ok(new { messages = messages });
                }

                return Ok(new { messages = "Nenhuma mensagem encontrada" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro ao carregar mensagens", error = ex.Message });
            }
        }
    }
} 