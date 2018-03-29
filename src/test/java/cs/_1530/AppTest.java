package cs._1530;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

class AppTest {

    @Test
    void myFirstTest() {
        assertEquals(2, 1 + 1);
    }

    @Test
    void mySecondTest() {
        App app = new App();
        assertEquals(3, app.getThree());
    }

}
