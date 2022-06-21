function Animation(rate) { // создаем класс Animation 
        this.LastTime = 0;
        this.Rate = rate; // этот параметр задает как часто мы будет обновлять нашу анимацю в мм сек
        this.update = function () {}; // update, render - это пустые объекты, у каждого объекта они будут свои
        this.render = function () {};
      }

      Animation.prototype.run = function(time) { // создаем метод, который будет обновлять все в цикле - он будет один для всех видов анимации, поэтому задаем его через прототип
        if((time - this.LastTime) > this.Rate ) { // метод run обновляет нашу анимацию методом update через заданные rate промежутками времени и вызывает метод render
          this.LastTime = time;
          this.update();
        }
        this.render();
      };

      // layer1 - создаем 1 слой, он у нас статический
      var layer1 = new Animation(30); // мы будем задавать rate в 30 мм сек для всех анимаций заднего плана, так как этот слой статичный, то нам не нужен метод update
      layer1.sx = 0; // sx, sy - это координаты нашего слоя на файле art
      layer1.sy = 0;
      layer1.w = 1024; // ширина нашего слоя
      layer1.h = 600; // высота нашего слоя
      layer1.render = function () { // redner - делает вывод слоя и добавляет нашу анимацию в цикл
        var x = 0; // переменная для начала отрисовки на канвасе
        var screen_w = canvas.width; // ширина канваса в переменной
        while(x < screen_w) { // когда х станет больше ширины канваса
          var draw_w = Math.min(this.w , screen_w - x); // сраниваем ширину слоя и оставшуюся область, и отрисовываем наименьшее, тем самым обрезаем лишнее
          ctx.drawImage(art, this.sx, this.sy, draw_w, this.h,
                              x, 0, draw_w, this.h); // отрисовываем наш слой
          x += this.w; // увеличиваем х на ширину слоя
        }
        // луна
        ctx.drawImage(art, 1024,0,300,300,
                            100,0,300,300); // отрисовываем луну
      };

      // layer2 - слой леса, который двигается со смещением
      var layer2 = new Animation(30);
      layer2.sx = 0; // sx, sy - это координаты нашего слоя на файле art
      layer2.sy = 600;
      layer2.w = 1664; // ширина нашего слоя
      layer2.h = 600; // высота нашего слоя
      layer2.dx = 0; // перемещение слоя по экрану
      layer2.speed = 1; // скорость перемещения
      layer2.update = function () { // пробуем сместить слой вперед 
        this.dx += this.speed; // так как dx постоянно увеличивается
        if(this.dx > this.w) { // поэтому слой перемещается непрерывно и уходит за экран, для этого нам нужно вернуть его на место в определенный момент
          this.dx -= this.w; // создадим условие, в котором обнулим dx
        }
      };

      layer2.render = function() {
        var x = 0; // перемещаем переменную х на начало нашей картинки
        var screen_w = canvas.width;
        if((this.w - this.dx) > 0) {
          ctx.drawImage(art, this.sx + this.dx, this.sy, this.w - this.dx, this.h,
                          x,0,this.w - this.dx, this.h); // отрисовываем наш слой
          x += this.w - this.dx;
        }
        while(x < screen_w) { // когда х станет больше ширины канваса
          var draw_w = Math.min(this.w , screen_w - x); // сраниваем ширину слоя и оставшуюся область, и отрисовываем наименьшее, тем самым обрезаем лишнее
          ctx.drawImage(art, this.sx, this.sy, draw_w, this.h,
                              x, 0, draw_w, this.h); // отрисовываем наш слой
          x += this.w; // увеличиваем х на ширину слоя
        }
      };

      // layer3 - слой облаков
      var layer3 = new Animation(30);
      layer3.sx = 0; // sx, sy - это координаты нашего слоя на файле art
      layer3.sy = 1200;
      layer3.w = 1664; // ширина нашего слоя
      layer3.h = 600; // высота нашего слоя
      layer3.dx = 0; // перемещение слоя по экрану
      layer3.speed = 3; // скорость перемещения
      layer3.update = layer2.update; // обновление слоя и его прорисовка
      layer3.render = layer2.render; // вывод этого слоя и добавим нашу анимацию в цикл

      // layer4 - слой домиков
      var layer4 = new Animation(30);
      layer4.sx = 0; // sx, sy - это координаты нашего слоя на файле art
      layer4.sy = 1800;
      layer4.w = 1664; // ширина нашего слоя
      layer4.h = 600; // высота нашего слоя
      layer4.dx = 0; // перемещение слоя по экрану
      layer4.speed = 6; // скорость перемещения
      layer4.update = layer2.update; // обновление слоя и его прорисовка
      layer4.render = layer2.render; // вывод этого слоя и добавим нашу анимацию в цикл

      // layer5 - слой снега
      var layer5 = new Animation(30);
      layer5.sx = 0; // sx, sy - это координаты нашего слоя на файле art
      layer5.sy = 2400;
      layer5.w = 1664; // ширина нашего слоя
      layer5.h = 600; // высота нашего слоя
      layer5.dx = 0; // перемещение слоя по экрану
      layer5.speed = 10; // скорость перемещения
      layer5.update = layer2.update; // обновление слоя и его прорисовка
      layer5.render = layer2.render; // вывод этого слоя и добавим нашу анимацию в цикл

      var ded_moroz = new Animation(50); // создаем новый экземпляр класса Animation для дед мороза
      ded_moroz.frame_num = 0;

      ded_moroz.get_frame = function() { // специальный метод для расчета координат 
        if(this.frame_num > 7) { // > 7 потому что в первом и во втором ряду на картинке по 7 спрайтов
          return {x:((this.frame_num - 8)*150),y:3150}; // возращаем координаты по х для каждого спрайта
        } else {
          return {x:(this.frame_num*150),y:3000}; // возращаем координаты по у для каждого спрайта
        }
      };

      ded_moroz.update = function() { // будем переключать номер спрайта, то есть frame от 0 до 16
        this.frame_num++;
        if(this.frame_num > 15) this.frame_num = 0;
      };
       
      ded_moroz.render = function() { // отрисовка спрайта
        var frame = this.get_frame();
        ctx.drawImage(art,frame.x,frame.y,150,150,
                          150,450,150,150);
      };

      function MainLoop(time) { // создаем основной цикл
        layer1.run(time); // добавляем каждый слой в цикл
        layer2.run(time);
        layer3.run(time);
        layer4.run(time);
        layer5.run(time);
        ded_moroz.run(time);
        requestAnimationFrame(MainLoop);
      }

      var canvas = document.getElementById('canvas'); // получаем канвас 
      var ctx = canvas.getContext('2d'); // создать 2d анимацию
      var art = new  Image(); // загружаем графику

      art.onload = function() { // при загрузке страницы будет вызвана функция основного цикла
        requestAnimationFrame(MainLoop);
      }

      art.src = "art.png"; // получаем ссылку на картинку

      resizeCanvas(); // данная функция вызывается каждый раз при изменении ширины документа, так как ширина у нас динамическая

      function resizeCanvas() {
        canvas.width = window.innerWidth - 40; // задаем ширину канваса равную ширине нашего окна с учетом отступов
      }
