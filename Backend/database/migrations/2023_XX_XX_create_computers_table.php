public function up()
{
    Schema::create('computers', function (Blueprint $table) {
        $table->id();
        $table->string('gyarto');
        $table->string('tipus');
        $table->integer('ram');
        $table->integer('ssd');
        $table->boolean('monitor');
        $table->timestamps();
    });
}

public function down()
{
    Schema::dropIfExists('computers');
}
