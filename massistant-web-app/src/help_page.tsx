import {Accordion, AccordionSummary, AccordionDetails, Box, Button, Stack} from "@mui/material";
import {AudioFileRounded, Save, UploadFileRounded} from "@mui/icons-material";
import {LoadingButton} from "@mui/lab";
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import './help-page.css';

export const HelpPage = () => {
    return <div style={{ paddingTop: '1em' }}>
      <Stack spacing={1}>
        <Accordion className="cheat list-accordion" sx={{ borderRadius: '16px' }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Начало использования</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Уважаемый пользователь, спасибо за регистрацию! Для использования сервиса вам необходимо перейти в раздел «Конспект».
                В нем будут находиться обработанные аудиолекции.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion className="cheat list-accordion" sx={{ borderRadius: '16px' }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Typography>Загрузка файлов</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Для того, чтобы загрузить новую запись - нажмите на кнопку
                «Загрузить запись лекции» в правом нижнем углу экрана. В форме загрузки файла вы сможете выбрать один из режимов обработки
                «Быстрый» и «Точный».
                <br/>
                «Быстрый» - ускоренный метод анализа аудио, может использоваться в тех случаях, когда нужно срочно
                подготовить материал для объемной лекции или курсу лекций, в которых не так критичны ошибки транскрибации.
                <br/>По умолчанию используется «Обычный» режим. Анализ в этом режиме соотвествует должному уровню, однако он может занимать чуть больше времени.
            </Typography>
          </AccordionDetails>
        </Accordion>
          <Accordion className="cheat list-accordion" sx={{ borderRadius: '16px' }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Typography>Карточка лекции</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
                После загрузки файла в разделе «Конспект» появится карточка вашей лекции. На ней будет указана краткая информация
                - название файла и дата загрузки. При нажатии на карточку - раскрывается более подробная информация о лекции. Здесь
                содержится 3 основных блока: «Транскрибация», «Глоссарий» и «Краткое содержание». Если аудиозапись длинная и
                обработка еще не завершена возможно отображение индикатора загрузки.
                <br/>
                • «Транскрибация» содержит полный текст лекции.
                <br/>
                • «Глоссарий» содержит важные термины и определения из лекции (возможно упоминание определений из сторонних источников).
                Также рядом с каждым определением содержится таймкод упоминания данного термина в аудиолекции. При нажатии на этот код
                происходит перемотка аудио в нужный момент.
                  <br/>
                • «Краткое содержание» включает сокращенную информацию разделенную по смысловым блокам.
            </Typography>
          </AccordionDetails>
        </Accordion>
          <Accordion className="cheat list-accordion" sx={{ borderRadius: '16px' }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Typography>Редактирование</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
                Чтобы отредактировать контент нажмите на кнопку «карандаш» рядом с текстом. После изменений нажмите на кнопку «сохранить».
            </Typography>
          </AccordionDetails>
        </Accordion>
          <Accordion className="cheat list-accordion" sx={{ borderRadius: '16px' }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Typography>Воспроизведение аудио</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
                Если вы хотите вспомнить о чем лекция или проверить правильность обработки, в нашем сервисе для этого предусмотрен встроенный аудиоплеер.
                Чтобы активировать его - нажмите на кнопку «плэй» рядом с любой из лекций. Снизу страницы появится аудиоплеер, с возможностью перемотки,
                регулировки звука и переключения лекций.
            </Typography>
          </AccordionDetails>
        </Accordion>
          <Accordion className="cheat list-accordion" sx={{ borderRadius: '16px' }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Typography>Удаление карточек лекций</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
                Чтобы удалить определенную карточку, перейдите в «Конспект», найдите необходимую карточку и нажмите на значок «урны».
            </Typography>
          </AccordionDetails>
        </Accordion>
          <Accordion className="cheat list-accordion"  sx={{ borderRadius: '16px' }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Typography>Сохранение обработанных конспектов</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
                Чтобы сохранить обработанный конспект (формат docx) - раскройте полную информацию нажатием на карточку,
                нажмите на кнопку «Скачать» и выберите место загрузки файла.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Stack>
    </div>;
};